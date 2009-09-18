//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.1-b02-fcs 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2009.09.07 at 02:19:19 PM CEST 
//

package de.hpi.bpmn2_0.model;

/**
 * Copyright (c) 2009
 * Philipp Giese, Sven Wagner-Boysen
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlIDREF;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for tSequenceFlow complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="tSequenceFlow">
 *   &lt;complexContent>
 *     &lt;extension base="{http://www.omg.org/bpmn20}tFlowElement">
 *       &lt;sequence>
 *         &lt;element name="conditionExpression" type="{http://www.omg.org/bpmn20}tExpression" minOccurs="0"/>
 *       &lt;/sequence>
 *       &lt;attribute name="sourceRef" use="required" type="{http://www.w3.org/2001/XMLSchema}IDREF" />
 *       &lt;attribute name="targetRef" use="required" type="{http://www.w3.org/2001/XMLSchema}IDREF" />
 *       &lt;attribute name="isImmediate" type="{http://www.w3.org/2001/XMLSchema}boolean" default="true" />
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlRootElement(name = "sequenceFlow", namespace = "http://www.omg.org/bpmn20")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "tSequenceFlow", propOrder = {
//    "conditionExpression"
})
public class SequenceFlow
    extends Edge
{
	
	@XmlElementRef
    protected Expression conditionExpression;
    @XmlAttribute
    protected Boolean isImmediate;

    /**
     * Gets the value of the conditionExpression property.
     * 
     * @return
     *     possible object is
     *     {@link Expression }
     *     
     */
    public Expression getConditionExpression() {
    	return conditionExpression;
    }

    /**
     * Sets the value of the conditionExpression property.
     * 
     * @param value
     *     allowed object is
     *     {@link Expression }
     *     
     */
    public void setConditionExpression(Expression value) {
        this.conditionExpression = value;
    }


    /**
     * Gets the value of the isImmediate property.
     * 
     * @return
     *     possible object is
     *     {@link Boolean }
     *     
     */
    public boolean isIsImmediate() {
        if (isImmediate == null) {
            return true;
        } else {
            return isImmediate;
        }
    }

    /**
     * Sets the value of the isImmediate property.
     * 
     * @param value
     *     allowed object is
     *     {@link Boolean }
     *     
     */
    public void setIsImmediate(Boolean value) {
        this.isImmediate = value;
    }

}
